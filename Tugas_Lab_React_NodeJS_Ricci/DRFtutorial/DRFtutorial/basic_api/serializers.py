# serializers.py
from rest_framework import serializers
from .models import DRFPost

class DRFPostSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=False)  # Make it optional for updates
    
    class Meta:
        model = DRFPost
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.photo:
            request = self.context.get('request')
            if request is not None:
                representation['photo'] = request.build_absolute_uri(instance.photo.url)
            else:
                representation['photo'] = instance.photo.url
        return representation
    
    def update(self, instance, validated_data):
        # Handle photo update explicitly
        photo = validated_data.pop('photo', None)
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Update photo if provided
        if photo:
            instance.photo = photo
        
        instance.save()
        return instance